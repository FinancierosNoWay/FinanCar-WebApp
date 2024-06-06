pipeline {
  agent any

  tools {
    nodejs "node"
  }

  parameters {
    string(name: 'container_name', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'image_name', defaultValue: 'pagina_img', description: 'Nombre de la imagen de docker.')
    string(name: 'tag_image', defaultValue: 'lts', description: 'Tag de la imagen de la página.')
    string(name: 'container_port', defaultValue: '80', description: 'Puerto que usa el contenedor')
  }

  stages {
    stage('install') {
      steps {
        git branch: 'main', url: 'https://github.com/FinancierosNoWay/FinanCar-WebApp.git'
        bat 'npm install'
      }
    }

    stage('test') {
      steps {
        bat 'npm run test --configuration=headless'
      }
    }

    stage('build') {
      steps {
        dir('C:\\Users\\PC\\Desktop\\Diseño de Experimentos\\FinanCar-WebApp') {
          script {
            try {
              bat 'docker stop ${container_name}'
              bat 'docker rm ${container_name}'
              bat 'docker rmi ${image_name}:${tag_image}'
            } catch (Exception e) {
              echo 'Exception occurred: ' + e.toString()
            }
          }
          bat 'docker build -t nombre-imagen .'
        }
      }
    }
    stage('deploy') {
      steps {
        bat "docker run -d -p 8080:80 --name nombre-contenedor nombre-imagen "
      }
    }
  }
}

