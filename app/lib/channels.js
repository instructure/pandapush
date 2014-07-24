
// a channel name looks like this:
//
// /<applicationId>/private-<string>/path/to/whatever
//
//

exports.parse = function(channel) {
  var components = channel.split('/');
  if (components.length < 3) {
    return null;
  }

  var res = {
    applicationId: components[1],
    path: '/' + components.slice(2).join("/"),
    components: components.slice(2)
  };

  var initial = components[2];
  if (initial === 'private') {
    res.private = true;
  }
  else if (initial === 'public') {
    res.public = true;
  }
  else {
    // channel names must start with public or private
    return null;
  }

  return res;
}
