// models/index.js (مثال)
import { User } from "./User.js";
import { RefreshToken } from "./RefreshToken.js";

User.hasMany(RefreshToken);
RefreshToken.belongsTo(User);

export { User, RefreshToken };
