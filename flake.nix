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

        # Checks run with `nix flake check`
        checks = {
          # Lint check
          lint = pkgs.runCommandLocal "lint-check" {
            src = ./.;
            nativeBuildInputs = [ pkgs.bun pkgs.nodejs_20 ];
          } ''
            export HOME=$(mktemp -d)
            cp -r $src $HOME/src
            chmod -R +w $HOME/src
            cd $HOME/src
            ${pkgs.bun}/bin/bun install --frozen-lockfile
            ${pkgs.bun}/bin/bun run lint
            mkdir "$out"
          '';

          # Build check
          build = pkgs.runCommandLocal "build-check" {
            src = ./.;
            nativeBuildInputs = [ pkgs.bun pkgs.nodejs_20 ];
          } ''
            export HOME=$(mktemp -d)
            cp -r $src $HOME/src
            chmod -R +w $HOME/src
            cd $HOME/src
            ${pkgs.bun}/bin/bun install --frozen-lockfile
            ${pkgs.bun}/bin/bun run build
            mkdir "$out"
          '';

          # Playwright test check
          test = pkgs.runCommandLocal "playwright-test" {
            src = ./.;
            nativeBuildInputs = [ pkgs.bun pkgs.nodejs_20 pkgs.chromium ];
          } ''
            export HOME=$(mktemp -d)
            cp -r $src $HOME/src
            chmod -R +w $HOME/src
            cd $HOME/src
            export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=${pkgs.chromium}/bin/chromium
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
            ${pkgs.bun}/bin/bun install --frozen-lockfile
            ${pkgs.bun}/bin/bunx playwright test
            mkdir "$out"
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
