// src/infrastructure/database/mongoose/plugins/stringId.plugin.ts
import mongoose, { Schema } from "mongoose";

function stringifyIds(obj): void {
  if (obj == null || typeof obj !== "object") return;

  if (obj instanceof mongoose.Types.ObjectId) {
    // replace ObjectId instance with its string value
    (obj as unknown as any) = obj.toString();
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((v, i) => (obj[i] = stringifyIds(v)));
  } else {
    Object.keys(obj).forEach(k => {
      obj[k] = stringifyIds(obj[k]);
    });
  }
}

export function stringIdPlugin(schema: Schema): void {
  const transform = (_: unknown, ret) => {
    stringifyIds(ret);
    return ret;
  };

  schema.set("toObject", { transform });
  schema.set("toJSON",  { transform });
}
