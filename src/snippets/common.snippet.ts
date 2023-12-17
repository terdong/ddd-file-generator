/*
 * File: controller.snippet.ts
 * Project: e:\etc\vs-extension\ff-generator-for-ddd
 * Created Date: 2023/12/17 Sun 10:40:38
 * Author: Donghee Kim (terdong@gmail.com)
 * -----
 * Last Modified: 2023/12/17 Sun 11:45:16
 * Modified By: Donghee Kim (terdong@gmail.com)
 * -----
 * Copyright (c) 2023 TeamGehem
 * -----
 * HISTORY:
 * Date      	By	Comments
 * ----------	---	---------------------------------------------------------
 */

export const getCommonSnippet: (packagePath: string, name: string) => string = (packagePath, name) => `
package ${packagePath}

object ${name}:

end ${name}
`
