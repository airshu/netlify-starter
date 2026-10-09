module.exports.handler = async (event, context) => {
  const shape = {};
  if (event) {
    for (const k of ['url', 'path', 'rawUrl', 'rawPath', 'httpMethod', 'method', 'version']) {
      if (event[k] !== undefined) shape[k] = event[k];
    }
    shape.topKeys = Object.keys(event).slice(0, 25);
  } else {
    shape.note = 'event is falsy';
  }
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(shape, null, 2),
  };
};
