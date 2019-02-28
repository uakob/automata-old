const states = new Map([
  [
    {'status': 'init', 'visible': false},
    new Map([
      ['play', 
        {'status': 'playing'}], // partial delta
      ['stop',
        {'status': 'stopped'}]
    ])
  ],
  [
    {'status': 'playing', 'visible': false},
    new Map([
      ['show',
        {'visible': true}],
      ['stop',
        {'status': 'stopped'}],
    ])
  ],
  [
    {'status': 'playing', 'visible': true},
    new Map([
      ['hide',
        {'visible': false}],
      ['stop',
        {'status': 'stopped'}],
    ])
  ],
  [
    {'status': 'stopped', 'visible': true},
    new Map([
      ['play',
        {'status': 'playing'}],
      ['kill',
        {'status': 'terminate'}],
      ['hide',
        {'visible': false}],
    ])
  ],
  [
    {'status': 'stopped', 'visible': false},
    new Map([
      ['play',
        {'status': 'playing'}],
      ['kill',
        {'status': 'terminate'}],
      ['show',
        {'visible': true}],
    ])
  ]
]);
