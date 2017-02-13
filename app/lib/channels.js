
// a channel name looks like this:
//
// /<applicationId>/<public|private|meta>/path/to/whatever
//
//

exports.parse = function (channel) {
  const components = channel.split('/');
  if (components.length < 3) {
    return null;
  }

  const res = {
    applicationId: components[1],
    path: '/' + components.slice(2).join('/'),
    components: components.slice(2)
  };

  const type = components[2];
  if (type === 'private') {
    res.private = true;
  } else if (type === 'public') {
    res.public = true;
  } else if (type === 'meta') {
    res.meta = true;
  } else if (type === 'presence') {
    res.presence = true;
  } else {
    // channel names must start with public, private, or meta
    return null;
  }

  return res;
};
