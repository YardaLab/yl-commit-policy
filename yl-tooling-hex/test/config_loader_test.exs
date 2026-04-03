defmodule YlTooling.ConfigLoaderTest do
  use ExUnit.Case

  test "loads config" do
    config = YlTooling.ConfigLoader.load()

    assert config != nil
  end
end