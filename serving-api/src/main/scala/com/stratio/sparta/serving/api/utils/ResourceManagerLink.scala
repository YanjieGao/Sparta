/**
 * Copyright (C) 2015 Stratio (http://stratio.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.stratio.sparta.serving.api.utils

import java.net.Socket

import scala.util._

import akka.event.slf4j.SLF4JLogging

import com.stratio.sparta.serving.core.SpartaConfig
import com.stratio.sparta.serving.core.constants.AppConstant

object ResourceManagerLink extends SLF4JLogging {

  def getLink: Option[String] = {
    val (host: String, port: Int) = SpartaConfig.getDetailConfig.get.getString(AppConstant.ExecutionMode) match {
      case AppConstant.ConfigMesos => mesosLink
      case AppConstant.ConfigYarn => yarnLink
      case AppConstant.ConfigStandAlone => standaloneLink
      case _ => ("localhost", 4040)
    }

    Try({
      new Socket(host, port)
    }) match {
      case Success(socket) => {
        if (socket.isConnected) {
          socket.close()
          Option(s"http://${host}:${port}")
        } else {
          socket.close()
          None
        }
      }
      case Failure(_) => {
        log.debug(s"Cannot connect to http://${host}:${port}. Log link won't be shown in UI.")
        None
      }
    }
  }

  private def mesosLink = {
    val mesosDispatcherUrl = SpartaConfig.getClusterConfig.get.getString(AppConstant.MesosMasterDispatchers)
    val host = mesosDispatcherUrl.replace("mesos://", "").replaceAll(":\\d+", "")
    val port = 5050
    (host, port)
  }

  private def yarnLink = {
    val host = SpartaConfig.getHdfsConfig.get.getString("hdfsMaster")
    val port = 8088
    (host, port)
  }

  private def standaloneLink = {
    val sparkUrl = SpartaConfig.getClusterConfig.get.getString("master")
    val host = sparkUrl.replace("spark://", "").replaceAll(":\\d+", "")
    val port = 4040
    (host, port)
  }

}
