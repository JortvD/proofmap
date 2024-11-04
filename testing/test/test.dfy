module test {
  class Test {
    method test() returns (pm_output: bool) 
      ensures true
    {
      return 0 > 0;
    }
  }
  method test2() returns (pm_output: bool) 
    requires true
  {
    return 1 > 0;
  }
}