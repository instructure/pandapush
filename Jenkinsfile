pipeline {
  agent { label 'docker' }

  environment {
    COMPOSE_FILE = './docker-compose.yml:./docker-compose.jenkins.yml'
  }

  options {
    disableConcurrentBuilds()
  }

  stages {
    stage('Build') {
      steps {
        sh 'rm -fr coverage'
        sh 'mkdir tmp'
        sh 'docker-compose build --pull --parallel'
        sh 'docker-compose up -d redis1 redis2 web'
        sh 'docker-compose run --rm gergich reset'
      }
    }
    stage('Lint') {
      steps {
        sh 'docker-compose run --rm web npm run eslint > tmp/eslint.out'
		sh 'cat tmp/eslint.out'
        sh 'cat tmp/eslint.out | sed \'s/\\/usr\\/src\\/app\\///\' | docker-compose run --rm gergich capture eslint -'
      }
    }
    stage('Tests') {
      steps {
        sh '''
          docker-compose run --rm web npm run test:coverage
          image=$(docker ps --all --no-trunc | grep web | cut -f 1 -d " " | head -n 1)
          docker cp $image:/usr/src/app/coverage ./coverage
          mv coverage/lcov-report/* coverage
        '''

        // publish html
        publishHTML target: [
          allowMissing: false,
          alwaysLinkToLastBuild: false,
          keepAll: true,
          reportDir: "coverage",
          reportFiles: 'index.html',
          reportName: 'Coverage Report'
        ]

        sh '''
          COVERAGE=$(docker-compose run --rm web bash -c "cat coverage/clover.xml | grep metrics | head -1 | ruby format_coverage.rb")
          docker-compose run --rm gergich message "$COVERAGE"
        '''
      }
    }
    stage('Cloudgate') {
      when { environment name: "GERRIT_EVENT_TYPE", value: "change-merged" }
      steps {
        build job: 'pandapush-instructure', parameters: [
          string(name: 'GIT_SHA', value: sh(script: "git rev-parse HEAD", returnStdout:true).trim()),
          string(name: 'GERRIT_REFSPEC', value: 'refs/heads/master')
        ], wait: true
      }
    }
  }
  post {
    always {
      sh 'docker-compose run --rm gergich publish'
    }
    cleanup { // Always runs after all other post conditions
        sh 'docker-compose down --volumes --remove-orphans --rmi all'
    }
  }
}
