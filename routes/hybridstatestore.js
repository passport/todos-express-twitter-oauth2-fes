function HybridStateStore() {
}

HybridStateStore.prototype.store = function(req, verifier, state, meta, callback) {
  // TODO: throw error, shouldn't be used
};

HybridStateStore.prototype.verify = function(req, state, cb) {
  console.log('VERIFY STATE');
  console.log(req.headers);
  console.log(req.body)
  console.log(state);
  
  
  return cb(null, req.body.code_verifier || true);
};

// Expose constructor.
module.exports = HybridStateStore;
