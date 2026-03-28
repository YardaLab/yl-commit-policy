defmodule Mix.Tasks.Yl.Commit.CheckTest do
  use ExUnit.Case

  test "returns ok for valid commit" do
    result = Mix.Tasks.Yl.Commit.Check.run(["feat(core): YLDTE-4 test"])

    assert result == :ok
  end
end