# Local includes

You can use this directory to store your own custom includes. They will be available to all pipelines in the project.

Add a reference to them in the `includes` section of your `full-ci.yml` pipeline definition file.

For example:

```yaml
include:
  - dataops/pipelines/includes/local_includes/my_job.md
```

Use cases for creating custom "local" jobs:

- You want to create a job that is not available in the reference project
- You want to override a reference project job with your own custom version
