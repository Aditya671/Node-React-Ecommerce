import path,{dirname} from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const applicationPath = (fileName = "") => path.join(__dirname,`../../../${fileName}`)