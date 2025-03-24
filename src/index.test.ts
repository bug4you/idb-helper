import {describe, it, expect, beforeEach, afterEach} from "vitest";
import IDBHelper from "./index";

const DB_NAME = "testDB";
const STORE_NAME = "testStore";
let idbHelper: IDBHelper;

describe("IDBHelper", () => {
    beforeEach(() => {
        idbHelper = new IDBHelper(DB_NAME, STORE_NAME);
    });

    afterEach(async () => {
        await idbHelper.clear(); // Har testdan keyin bazani tozalaymiz
    });

    it("should add and retrieve an item", async () => {
        const data = {id: 1, name: "Test Item"};
        await idbHelper.setItem(data);

        const retrieved = await idbHelper.getItem<typeof data>(1);
        expect(retrieved).toEqual(data);
    });

    it("should retrieve all items", async () => {
        await idbHelper.setItem({name: "Item 1"});
        await idbHelper.setItem({name: "Item 2"});

        const allItems = await idbHelper.getAllItems();
        expect(allItems.length).toBe(2);
        expect(allItems).toEqual(
            expect.arrayContaining([{name: "Item 1"}, {name: "Item 2"}])
        );
    });

    it("should delete an item", async () => {
        const id = await idbHelper.setItem({name: "Item to Delete"});
        await idbHelper.removeItem(id);

        const retrieved = await idbHelper.getItem(id);
        expect(retrieved).toBeUndefined();
    });

    it("should clear all items", async () => {
        await idbHelper.setItem({name: "Item 1"});
        await idbHelper.setItem({name: "Item 2"});

        await idbHelper.clear();
        const allItems = await idbHelper.getAllItems();
        expect(allItems.length).toBe(0);
    });
});
