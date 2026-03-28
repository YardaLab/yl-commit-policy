defmodule YlTooling.ValidatorTest do
  use ExUnit.Case

  test "valid commit" do
    result = YlTooling.Validator.validate("feat(core): YLDTE-4 test")

    assert result.valid == true
  end

  test "invalid commit" do
    result = YlTooling.Validator.validate("invalid message")

    assert result.valid == false
  end
end