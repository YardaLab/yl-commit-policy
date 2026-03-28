defmodule YlTooling.Validator do
  def validate(msg) when is_binary(msg) do
    if String.contains?(msg, "feat(") do
      %{valid: true, errors: []}
    else
      %{valid: false, errors: ["INVALID_FORMAT"]}
    end
  end
end