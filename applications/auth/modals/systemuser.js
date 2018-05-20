export default {
  id: { type: "auto" },
  username: { type: "string", max: 50, unique: true, required: true },
  password: { type: "string", required: true },
  name: { type: "string", required: true },
  email: { type: "string" }
}