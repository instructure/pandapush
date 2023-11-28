pipeline {
    agent any
    options { ansiColor('xterm') }

    stages {
        stage ('RunSnykCheck') {
            agent any
            steps {
                build(job: '../snyk image scan',
                    parameters: [
                        string(name: 'PROJECT_NAME', value: 'Pandapush Image Scan'),
                        string(name: 'SLACK_JOB_NAME', value: 'pandapush snyk'),
                        string(name: 'APP_IMG', value: 'starlord.inscloudgate.net/deploy/pandapush:latest'),
                        string(name: 'REPOSITORY_URL', value: 'https://jenkins@gerrit.instructure.com/a/pandapush'),
                        string(name: 'SNYK_IMG', value: 'snyk/snyk:docker'),
                        string(name: 'SNYK_FILE_PARAM', value: 'Dockerfile'),
                        string(name: 'SEVERITY_THRESHOLD', value: 'high'),
                        booleanParam(name: 'WITH_MONITORING', value: true),
                        string(name: 'SLACK_CHANNEL', value: '#appservices-jenkins')
                    ],
                    propagate: true)
            }
        }
    }
}
