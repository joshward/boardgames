import * as v from "valibot";
import toNumber from "strnum";
import { htmlUnescape } from "escape-goat";

export const ToStrNum = v.transform((val: string) => toNumber(val));

export const UnescapeHtml = v.transform((val: string) => htmlUnescape(val));
