defmodule YlTooling.CommitReaderTest do
  use ExUnit.Case

  test "reads commit message" do
    msg = YlTooling.CommitReader.read("feat(core): YLDTE-4 test")

    assert msg != nil
  end
end