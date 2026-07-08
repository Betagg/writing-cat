module.exports = function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: "writing-cat",
    message: "写作猫服务已启动",
  });
};
