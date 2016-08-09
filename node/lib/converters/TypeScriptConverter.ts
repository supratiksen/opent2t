
import {
    DeviceCharacteristic,
    DeviceInterface,
    DeviceMethod,
    DeviceParameter,
    DeviceProperty,
    JsonSchema,
} from "../DeviceInterface";

import * as fs from "mz/fs";

/**
 * Writes device interface specifications in TypeScript type-definition format.
 * A translator written in TypeScript can use the generated interface definitions
 * to have the compiler enforce proper implementation of device interfaces.
 */
export class TypeScriptConverter {

    /**
     * Writes device interfaces to a TypeScript type-definition file.
     *
     * @param {DeviceInterface[]} deviceInterfaces  One or more interfaces to write
     * @param {string} filePath  Path to the target type-definition (.d.ts) file
     */
    public static async writeDeviceInterfacesToFileAsync(
            deviceInterfaces: DeviceInterface[], filePath: string): Promise<void> {
        let tsCode: string = TypeScriptConverter.writeDeviceInterfaces(deviceInterfaces);
        await fs.writeFile(filePath, tsCode, "utf8");
    }

    /**
     * Writes device interfaces as TypeScript type-definitions.
     *
     * @param {DeviceInterface[]} deviceInterfaces  One or more interfaces to write
     * @returns {string} TypeScript type-definition code
     */
    public static writeDeviceInterfaces(deviceInterfaces: DeviceInterface[]): string {
        let ts = "// Generated by OpenT2T\n\n";

        deviceInterfaces.forEach((deviceInterface: DeviceInterface) => {
            let fullName = deviceInterface.name;
            let className = fullName.substr(fullName.lastIndexOf(".") + 1);
            let ns = className.length < fullName.length ?
                    fullName.substr(0, fullName.length - className.length - 1) : null;
            if (ns) {
                ts += "namespace " + ns + " {\n\n";
            }

            ts += "  export interface " + className;

            if (deviceInterface.references.length > 0) {
                ts += " extends " + deviceInterface.references.join(", ");
            }

            ts += " {\n\n";

            deviceInterface.properties.forEach((p: DeviceProperty) => {
                ts += TypeScriptConverter.writeProperty(p) + "\n";
            });

            deviceInterface.methods.forEach((m: DeviceMethod) => {
                ts += TypeScriptConverter.writeMethod(m);
            });

            ts += "  }\n\n";

            if (ns) {
                ts += "}\n\n";
            }
        });

        return ts;
    }

    /**
     * Converts a JSON schema to a TypeScript type.
     */
    public static jsonSchemaToTypeScriptType(schema: JsonSchema): string {
        if (!schema || !schema.type) {
            return "any";
        }

        // TODO: Convert complex types
        switch (schema.type) {
            case "integer":
            case "number": return "number";
            case "string": return "string";
            case "boolean": return "boolean";
            case "array": return "array";
            default: return "any";
        }
    }

    private static writeProperty(property: DeviceProperty): string {
        let comment = TypeScriptConverter.writeDescription(property);
        let type = TypeScriptConverter.jsonSchemaToTypeScriptType(property.propertyType);
        if (property.canRead && !property.canWrite) {
            return comment + "    readonly " + property.name + ": " + type + ";\n";
        } else if (property.canRead || property.canWrite) {
            // TypeScript doesn't support write-only property in interfaces.
            return comment + "    " + property.name + ": " + type + ";\n";
        } else {
            return "";
        }
    }

    private static writeMethod(method: DeviceMethod): string {
        let comment = TypeScriptConverter.writeDescription(method);
        let parameters = "";
        let returnType = "void";

        method.parameters.forEach((p: DeviceParameter) => {
            if (p.isOut) {
                if (returnType !== "void") {
                    throw new Error("Multiple out parameters are not supported");
                } else {
                    returnType = TypeScriptConverter.jsonSchemaToTypeScriptType(p.parameterType);
                }
            } else {
                if (parameters) {
                    parameters += ", ";
                }

                parameters += p.name + ": " +
                        TypeScriptConverter.jsonSchemaToTypeScriptType(p.parameterType);
            }
        });

        return comment + "    " + method.name + "(" + parameters + "): " + returnType + ";\n\n";
    }

    private static writeDescription(characteristic: DeviceCharacteristic): string {
        if (!characteristic.description) {
            return "";
        }

        return "    /**\n     * " + characteristic.description + "\n     */\n";
    }
}
