// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const network  = require('./network');

const app = options => {
  // Listen to the App Engine-specified port, or 8080 otherwise
  let port = process.env.PORT || 8080;
  port = options && options.port? options.port : 8080;

  console.log('1.app starting on port:', port)
  return network({port})
}
app()
//
module.exports = app;
