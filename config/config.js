module.exports = {
  port: process.env.PORT,
  local_client_app: process.env.LOCAL_CLIENT_APP,
  remote_client_app: process.env.REMOTE_CLIENT_APP,
  allowedDomains:
    process.env.NODE_ENV === "production"
      ? [process.env.REMOTE_CLIENT_APP, process.env.REMOTE_SERVER_API]
      : [process.env.LOCAL_CLIENT_APP, process.env.LOCAL_SERVER_API],
  Host_Mysql: process.env.HOST_MYSQL,
  User_Mysql: process.env.USER_MYSQL,
  Password_Mysql: process.env.PASSWORD_MYSQL,
};
