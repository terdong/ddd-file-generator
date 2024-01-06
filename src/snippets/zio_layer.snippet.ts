/*
 * File: controller.snippet.ts
 * Project: e:\etc\vs-extension\ff-generator-for-ddd
 * Created Date: 2023/12/17 Sun 10:40:38
 * Author: Donghee Kim (terdong@gmail.com)
 * -----
 * Last Modified: 2024/01/07 Sun 08:30:12
 * Modified By: Donghee Kim (terdong@gmail.com)
 * -----
 * Copyright (c) 2023 TeamGehem
 * -----
 * HISTORY:
 * Date      	By	Comments
 * ----------	---	---------------------------------------------------------
 */

export const getZioLayerSnippet: (packagePath: string, name: string) => string = (packagePath, name) =>
  `package ${packagePath}

import zio.*

trait ${name}

private[${packagePath.split('.').pop()}] case class ${name}Live() extends ${name}

object ${name}:
  lazy val layer = ZLayer.derive[${name}Live]
`
