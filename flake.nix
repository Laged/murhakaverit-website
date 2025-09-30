{
  description = "Murhakaverit Futuristic Vault site dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = false;
        };
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_20
            pkgs.bun
            pkgs.chromium
          ];

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=${pkgs.chromium}/bin/chromium
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
          '';
        };

        # Apps for convenience commands
        apps = {
          # Run tests interactively
          test = {
            type = "app";
            program = toString (pkgs.writeShellScript "test" ''
              export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=${pkgs.chromium}/bin/chromium
              export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
              ${pkgs.bun}/bin/bunx playwright test "$@"
            '');
          };

          # Run dev server
          dev = {
            type = "app";
            program = toString (pkgs.writeShellScript "dev" ''
              ${pkgs.bun}/bin/bun run dev
            '');
          };
        };
      }
    );
}
