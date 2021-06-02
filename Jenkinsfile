#!groovy
import groovy.json.JsonSlurperClassic
node {

    def BUILD_NUMBER=env.BUILD_NUMBER
    def RUN_ARTIFACT_DIR="tests/${BUILD_NUMBER}"
    def SFDC_USERNAME

    def HUB_ORG=env.HUB_ORG_DH
    def SFDC_HOST = env.SFDC_HOST_DH
    def JWT_KEY_CRED_ID = env.JWT_CRED_ID_DH
    def CONNECTED_APP_CONSUMER_KEY=env.CONNECTED_APP_CONSUMER_KEY_DH
    def SFDX_PATH = env.SFDX_PATH

    println 'KEY IS' 
    println JWT_KEY_CRED_ID
    println HUB_ORG
    println SFDC_HOST
    println CONNECTED_APP_CONSUMER_KEY
    println 'SFDX path is == '
    println SFDX_PATH
   //def toolbelt = tool 'toolbelt'

    stage('checkout source') {
        // when running in multi-branch job, one must issue this command
        checkout scm
    }
    withEnv(["HOME=${env.WORKSPACE}"]) {

        withCredentials([file(credentialsId: JWT_KEY_CRED_ID, variable: 'jwt_key_file')]) {      
            

            stage('Authorize Dev Hub') {
                /*
                rccc = bat returnStatus: true, script: "sfdx auth:logout -u ${HUB_ORG} -p"
                if (rccc != 0) { error 'Log out failed' }
                */

                //rct1 = bat returnStatus: true, script: "sfdx update"
                rct1 = bat returnStatus: true, script: "\"${SFDX_PATH}/sfdx\" plugins --core"
                //rct = bat returnStatus: true, script: "\"${toolbelt}/sfdx\" plugins --core"
                

                if (isUnix()) {
                    rc = sh returnStatus: true, script: "${SFDX_PATH}/sfdx force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile ${jwt_key_file} --setdefaultdevhubusername --instanceurl ${SFDC_HOST}"
                }else{
                    rc = bat returnStatus: true, script: "\"${SFDX_PATH}/sfdx\" auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile C:\Users\Administrator\Desktop\Softwares\server.key --setdefaultdevhubusername --instanceurl ${SFDC_HOST}"
                }
                if (rc != 0) { error 'hub org authorization failed' }

                println rc
            
            
            }

            stage('List Org'){
                rcc = bat returnStatus: true, script: "\"${SFDX_PATH}/sfdx\" force:org:list"
                if (rcc != 0) { error 'Org List failed' }
            }

            stage('Deploye Code'){
                // Deploy code
                println('Deploying code to the Org from Repository')
                if (isUnix()) {
                    rmsg = sh returnStdout: true, script: "${SFDX_PATH}/sfdx force:source:deploy -p force-app/. -u ${HUB_ORG}"
                }else{
                rmsg = bat returnStdout: true, script: "\"${SFDX_PATH}/sfdx\" force:source:deploy -p force-app/. -u ${HUB_ORG}"
                }
                
                printf rmsg
                println('Check deployment status')
                println(rmsg)

            }

            stage('Check Deployment Status'){
                //Check status
                if (isUnix()) {
                    rmsg1 = sh returnStdout: true, script: "${SFDX_PATH}/sfdx force:mdapi:deploy:report -u ${HUB_ORG}"
                }else{
                rmsg1 = bat returnStdout: true, script: "\"${SFDX_PATH}/sfdx\" force:mdapi:deploy:report -u ${HUB_ORG}"
                }

                println('Deployment report is -- ')
                println(rmsg1)

            }
        }
    }
}

def command(script) {
    if (isUnix()) {
        return sh(returnStatus: true, script: script);
    } else {
        return bat(returnStatus: true, script: script);
    }
}