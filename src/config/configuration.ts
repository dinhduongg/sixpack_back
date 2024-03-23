export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  jwtSecrect: process.env.JWT_SECRECT,
})
