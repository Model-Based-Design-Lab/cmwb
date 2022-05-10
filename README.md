# Computational Modeling Workbench

Software for the computational modeling workbench (CMWB)

The repository includes and builds on the following submodules.

- `cmlang`: Domain-specific languages for the various models of the computational modeling workbench with code generation and an LSP Language Server. [GitHub repository](https://github.com/Model-Based-Design-Lab/cmlang)
- `cmlib`: Python tools with algorithms for the models of the computational modeling workbench [GitHub repository](https://github.com/Model-Based-Design-Lab/cmlib)
- `cmtrace`: Library to visualize traces [GitHub repository](https://github.com/Model-Based-Design-Lab/cmtrace)

- Web Application. The web application on <https://computationalmodeling.info/cmwb> is in the `webapplication` directory.

## Local build with Docker

*Note that there is potentially an issue with path length limits when building the docker image on a Windows machine.
If it occurs it leads to a failure on a test that was added for this purpose. In that case, see below for further instructions.*

If the repository was cloned without recursively cloning submodules, clone them now.

``` sh
 git submodule update --init
```

The following will build and run the CMWB using [docker](docker.com).

``` shell
docker build . -f .\wslsp.Dockerfile -t wslsp
docker build . -t cmwb
docker compose up
```

After building images and starting is complete, the CMWB can be started from <localhost:7000/cmwb>

### Windows Path Length Limit Issue

In case you have hit the path length limit of 260 characters in Windows, there following should solve the issue. (See also [GitHub discussion](https://github.com/moby/buildkit/issues/1366)).

Replace the build command for the `cmwb` container with the following command:

``` sh
  docker build \\?\D:\long-path -t cmwb
  ```

where `D:\long-path` is replaced by the full path to this repository.
