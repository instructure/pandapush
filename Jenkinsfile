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
        sh 'docker compose build --pull --parallel'
        sh 'docker compose up -d redis1 redis2 web'
      }
    }
    stage('Lint') {
      steps {
        sh 'docker compose run --rm web npm run eslint'
      }
    }
    stage('Tests') {
      steps {
        sh '''
          docker compose run --rm web npm run test:coverage
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
      }
    }
  }
  post {
    cleanup {
      sh 'docker compose down --volumes --remove-orphans --rmi all'
    }
  }
}
