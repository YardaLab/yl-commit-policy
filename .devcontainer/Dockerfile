FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Node (TS část)
RUN apt-get update && \
    apt-get install -y curl ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Elixir + Erlang (Hex část)
RUN apt-get update && \
    apt-get install -y elixir erlang

# Cleanup
RUN apt-get clean && rm -rf /var/lib/apt/lists/*