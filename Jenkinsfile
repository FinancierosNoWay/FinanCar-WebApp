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
        git branch: 'main', url: 'https://github.com/JosueCarrascoH/FinanCar.git'
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
        script {
          try {
            bat "docker stop ${container_name}" // Detener el contenedor anterior si existe
            bat "docker rm ${container_name}"   // Eliminar el contenedor anterior si existe
            bat "docker rmi ${image_name}:${tag_image}" // Eliminar la imagen anterior si existe
          } catch (Exception e) {
            echo 'Exception occurred: ' + e.toString()
          }
        }
        bat 'npm run build'
        bat "docker build -t ${image_name}:${tag_image} ." // Construir la nueva imagen
      }
    }

    stage('deploy') {
      steps {
        script {
          // Ejecutar el contenedor con la nueva imagen
          bat "docker run -d -p ${container_port}:80 --name ${container_name} ${image_name}:${tag_image}"
        }
      }
    }
  }
}
