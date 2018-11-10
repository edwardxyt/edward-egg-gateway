// def CDN_DIR = 'static/website2018'
node() {

    stage('node server Stop') {
        sh "npm run stop"
    }

    stage('Checkout'){
        sh "echo PROJECT = ${params.PROJECT}"
        sh "echo INSTALL = ${params.INSTALL}"
        sh "echo ENV = ${params.ENV}"
        sh "echo FORCE = ${params.FORCE}"
        sh "echo INIT = ${params.INIT}"

        sh "echo WORKSPACE = $WORKSPACE"
        sh "echo BUILD_ID = $BUILD_ID"

        sh 'pwd'

        sh "echo BUILD_NUMBER = $BUILD_NUMBER"
        sh "echo JOB_NAME = $JOB_NAME"
        sh "echo JOB_BASE_NAME = $JOB_BASE_NAME"
        sh "echo BUILD_TAG = $BUILD_TAG"
        sh "echo EXECUTOR_NUMBER = $EXECUTOR_NUMBER"
        sh "echo NODE_NAME = $NODE_NAME"
        sh "echo NODE_LABELS = $NODE_LABELS"
        sh "echo JENKINS_HOME = $JENKINS_HOME"
        sh "echo JENKINS_URL = $JENKINS_URL"
        sh "echo BUILD_URL = $BUILD_URL"
        sh "echo JOB_URL = $JOB_URL"

        git branch: 'release-egg-gateway', url: 'ssh://git@47.93.203.255:29418/aliyun/egg-gateway.git'
        sh 'git status'
        sh 'git branch'

    }

    stage('Initialize'){
        if (params.FORCE){
            sh 'sh $WORKSPACE/init.sh'
            sh "cnpm install --production"
        }
        if (params.INIT){
            sh 'sh $WORKSPACE/init.sh'
        }
        if (params.INSTALL){
            sh "rm -rf node_modules"
            sh "cnpm i"
        }
    }

    stage('Publish') {
      if (params.COMMIT){
        dir('/root/.jenkins/workspace/server2018-delivery-egg-geteway'){
            sh 'git status'
            sh 'git config user.email "edward56833517@outlook.com"'
            sh 'git config user.name "linux"'
            sh 'git add -A'
            // sh 'git commit -am "no commit"'
            // sh 'git add .'
            sh 'git commit -m "no commit"'
            sh 'git pull origin release-egg-gateway'
            sh 'git push origin release-egg-gateway'
        }
      }
    }

    stage('node server Start') {
        withEnv(['JENKINS_NODE_COOKIE=dontkillme']){
            sh "npm run start"
            sh "ps -eo 'pid,command' | grep -- '--title=server2018-egg-geteway'"
        }
    }

}
