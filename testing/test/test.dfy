module test {
  class Test {
    predicate test() 
      ensures true
    {
      0 > 0
    }

    predicate test2() {
      1 > 0
    }
  }
}