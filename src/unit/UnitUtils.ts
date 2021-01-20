import { generateRandomNumString, getByKey } from "../utils/HelperFunctions";

export function generateUnitName(type: UnitType): string {
    const name: string = type + generateRandomNumString(4);

    // check validation of the name.
    if (Memory.get.all.units.map(getByKey<string>("name")).includes(name)) {
        // if the name has been in the existed units, re-generate one.
        return generateUnitName(type);
    } else {
        // else return the name as final result.
        return name;
    }
}
