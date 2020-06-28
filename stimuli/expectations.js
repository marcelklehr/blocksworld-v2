let expected_utts = {};
// TODO needs to be updated!
expected_utts["low_low_independent"] = ["Neither A(left) nor C(right).", "not A(left)", "not C(right)"]
expected_utts["low_low_if1"] = ["Neither A(left) nor C(right).", "not A(left)", "not C(right)",
  "If A(left) fell, C(right) would fall.(german: falls/sollte A(left) ...)", "If C(right), A(left)."]
expected_utts["low_low_if2"] = ["Neither A(left) nor C(right).", "not A(left)", "not C(right)",
  "[If A(left), C(right)]", "[If C(right), A(left)]"]

expected_utts["low_uncertain_independent"] = ["not A(left)", "maybe C(right)"]
expected_utts["low_uncertain_if1"] = ["not A(left)", "maybe C(right)",
  "If A(left) fell, C(right) would fall.(german: falls/sollte A(left) ...)"]
expected_utts["low_uncertain_if2"] = ["maybe C(right)",
  "If C(right) falls, A(left) falls.",  "A(left) may fall because of C(right)"]

expected_utts["low_high_independent"] = ["C(right) but not A(left)", "not A(left)", "C(right)", "probably C(right)"]
expected_utts["low_high_if1"] = ["C(right) but not A(left)", "not A(left)", "C(right)",
  "If A(left) falls, C(right) falls.(german: falls/sollte A(left) ...)"]
expected_utts["low_high_if2"] = ["C(right)", "C(right) may make A(left) fall", "maybe A(left)", "If A(left), C(right)."]

expected_utts["uncertain_low_independent"] = ["maybe A(left)", "probably A(left)", "not C(right)"]
expected_utts["uncertain_low_if1"] = ["probably A(left)", "If A(left), C(right)", "A(left) (may) make(s) C(right) fall",
  "maybe A(left)", "maybe C(right)"]
expected_utts["uncertain_low_if2"] = ["maybe A(left)", "If C(right), A(left)", "If A(left), probably C(right)"]

expected_utts["uncertain_uncertain_independent"] = ["A(left) and C(right) may both", "maybe A(left)", "maybe C(right)"]
expected_utts["uncertain_uncertain_if1"] = ["probably A(left) and C(right)", "A(left) and C(right)", "If A(left), C(right)"]
expected_utts["uncertain_uncertain_if2"] = ["maybe A(left)", "maybe C(right)", "If A(left), C(right)", "If C(right), A(left)"]

expected_utts["uncertain_high_independent"] = ["maybe A(left)", "C(right)"]
expected_utts["uncertain_high_if1"] = ["maybe A(left)", "C(right)", "[If A(left), C(right)]"]
expected_utts["uncertain_high_if2"] = ["maybe A(left)", "C(right)", "A(left) because of C(right)."]

expected_utts["high_low_independent"] = ["A(left) but not C(right)", "A(left)", "not C(right)"]
expected_utts["high_low_if1"] = ["C(right) because of A(left)", "A(left) and C(right)", "A(left)", "maybe C(right)"]
expected_utts["high_low_if2"] = ["A(left) but not C(right)", "If A(left), C(right) may fall.", "A(left) may/might make C(right) fall", "If C(right), A(left)."]

expected_utts["high_uncertain_independent"] = ["A(left)", "maybe C(right)", "probably C(right)"]
expected_utts["high_uncertain_if1"] = ["probably A(left) and C(right)", "A(left) and C(right)", "[C(right) because of A(left)]"]
expected_utts["high_uncertain_if2"] = ["probably A(left) and C(right)", "A(left) and C(right)", "A(left)",
  "maybe C(right)", "[If C(right), A(left)]", "[If A(left), C(right)]"]

expected_utts["high_high_independent"] = ["A(left) and C(right)"]
expected_utts["high_high_if1"] = ["A(left) and C(right)"]
expected_utts["high_high_if2"] = ["A(left) and C(right)", "If A(left), C(right)", "If C(right), A(left)"]

getExpectations = function(stimulus){
  let pa = stimulus.meta[0];
  let pc = stimulus.meta[1];
  let rel = stimulus.id.split('_')[0];
  let key = [pa, pc, rel].join("_");
  return expected_utts[key];
}
