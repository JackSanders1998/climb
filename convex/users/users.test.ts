import { convexTest, TestConvex } from "convex-test";
import { GenericSchema, SchemaDefinition } from "convex/server";
import { describe, expect, test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

const mockIdentity = (
  t: TestConvex<SchemaDefinition<GenericSchema, boolean>>,
) =>
  t.withIdentity({
    name: "Adam Ondra",
    tokenIdentifier: "ondra-token",
  });

describe("users.store", () => {
  test("Throw an error if a logged-out user tries to write to the db.", async () => {
    const t = convexTest(schema);

    const unauthorizedCall = async () => {
      await t.mutation(api.users.users.store);
    };

    await expect(unauthorizedCall).rejects.toThrow(
      "Called storeUser without authentication present",
    );
  });

  test("Successfully write a user to the db.", async () => {
    const t = convexTest(schema);
    const asOndra = mockIdentity(t);

    expect(await asOndra.mutation(api.users.users.store)).toEqual(
      "10000;users",
    );
  });
});

describe("users.get", () => {
  test("Throw an error if the requested user does not exist", async () => {
    const t = convexTest(schema);

    await expect(
      t.query(api.users.users.get, {
        // @ts-ignore --> this user does not exist
        id: "non-existent-user-id",
      }),
    ).rejects.toThrow(
      'Validator error: Expected ID for table "users", got `non-existent-user-id`',
    );
  });

  test("Get both users from the db if {id} is not passed", async () => {
    const t = convexTest(schema);
    const asOndra = mockIdentity(t);
    const asMagnus = t.withIdentity({
      name: "Magnus Midtbø",
      tokenIdentifier: "magnus-token",
    });
    await asOndra.mutation(api.users.users.store);
    await asMagnus.mutation(api.users.users.store);

    const getUsers = await t.query(api.users.users.get, {});

    expect(getUsers).toHaveLength(2);
    expect(getUsers).toMatchObject([
      {
        name: "Adam Ondra",
        tokenIdentifier: "ondra-token",
        _id: "10000;users",
        _creationTime: expect.any(Number),
      },
      {
        name: "Magnus Midtbø",
        tokenIdentifier: "magnus-token",
        _id: "10001;users",
        _creationTime: expect.any(Number),
      },
    ]);
  });

  test("Get each user on-by-one from the db with {id}", async () => {
    const t = convexTest(schema);
    const asOndra = mockIdentity(t);
    const asMagnus = t.withIdentity({
      name: "Magnus Midtbø",
      tokenIdentifier: "magnus-token",
    });
    await asOndra.mutation(api.users.users.store);
    await asMagnus.mutation(api.users.users.store);

    const ondra = await t.query(api.users.users.get, {
      // @ts-ignore --> ignoring generated convex types since this doesn't ~actually~ exist
      id: "10000;users",
    });
    const magnus = await t.query(api.users.users.get, {
      // @ts-ignore --> ignoring generated convex types since this doesn't ~actually~ exist
      id: "10001;users",
    });

    expect(ondra).toMatchObject({
      name: "Adam Ondra",
      tokenIdentifier: "ondra-token",
      _id: "10000;users",
      _creationTime: expect.any(Number),
    });
    expect(magnus).toMatchObject({
      name: "Magnus Midtbø",
      tokenIdentifier: "magnus-token",
      _id: "10001;users",
      _creationTime: expect.any(Number),
    });
  });

  test("Return an empty array if there isn't anything in the db", async () => {
    const t = convexTest(schema);

    await expect(t.query(api.users.users.get, {})).resolves.toEqual([]);
  });
});
