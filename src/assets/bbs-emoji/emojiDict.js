const dict = {
  'aj-1': 'aj-1.png',
  'aj-2': 'aj-2.png',
  'aj-3': 'aj-3.png',
  'aj-4': 'aj-4.png',
  'aj-5': 'aj-5.png',
  'aj-6': 'aj-6.png',
  'aj-7': 'aj-7.png',
  'aj-8': 'aj-8.png',
  'dj-1': 'dj-1.png',
  'dj-2': 'dj-2.png',
  'dj-3': 'dj-3.png',
  'dj-4': 'dj-4.png',
  'dj-5': 'dj-5.png',
  'dj-6': 'dj-6.png',
  'dj-7': 'dj-7.png',
  'dj-8': 'dj-8.png',
  'hy-1': 'hy-1.png',
  'hy-2': 'hy-2.png',
  'hy-3': 'hy-3.png',
  'hy-4': 'hy-4.png',
  'hy-5': 'hy-5.png',
  'hy-6': 'hy-6.png',
  'hy-7': 'hy-7.png',
  'hy-8': 'hy-8.png',
  'pj-1': 'pj-1.png',
  'pj-2': 'pj-2.png',
  'pj-3': 'pj-3.png',
  'pj-4': 'pj-4.png',
  'pj-5': 'pj-5.png',
  'pj-6': 'pj-6.png',
  'pj-7': 'pj-7.png',
  'pj-8': 'pj-8.png',
  'tz-1': 'tz-1.png',
  'tz-2': 'tz-2.png',
  'tz-3': 'tz-3.png',
  'tz-4': 'tz-4.png',
  'tz-5': 'tz-5.png',
  'tz-6': 'tz-6.png',
  'tz-7': 'tz-7.png',
  'tz-8': 'tz-8.png',
  'xx-1': 'xx-1.png',
  'xx-2': 'xx-2.png',
  'xx-3': 'xx-3.png',
  'xx-4': 'xx-4.png',
  'xx-5': 'xx-5.png',
  'xx-6': 'xx-6.png',
  'xx-7': 'xx-7.png',
  'xx-8': 'xx-8.png'
}

const index = {
  get: function (val) {
    return require('./' + dict[val])
  }
}

export default index
