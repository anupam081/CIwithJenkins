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

                //SFDx version
                rct1 = bat returnStatus: true, script: "\"${SFDX_PATH}/sfdx\" plugins --core"              
                
                //JWT Authorization
                rc = bat returnStatus: true, script: "\"${SFDX_PATH}/sfdx\" auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile \"${jwt_key_file}\" --setdefaultdevhubusername --instanceurl ${SFDC_HOST}"
                    
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
              
                rmsg = bat returnStatus: true, script: "\"${SFDX_PATH}/sfdx\" force:source:deploy -x manifest/package.xml -u ${HUB_ORG}"
                                
                println rmsg
                println('Check deployment status')
                println(rmsg)

            }

            stage('Check Deployment Status'){
                

                println('Deployment report is -- ')
                
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