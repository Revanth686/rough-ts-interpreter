// --------------------------------------------------
// ---------------    Environment     --------------
// -----    variable declaration, assignment, scope handling ------
//
//

import { type RuntimeVal } from "./values";

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varname: string,
    val: RuntimeVal,
    constant: boolean,
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Cannot declare a variable ${varname}. As it is already defined.`;
    }

    this.variables.set(varname, val);
    if (constant) this.constants.add(varname);
    return val;
  }

  public assignVar(varname: string, val: RuntimeVal): RuntimeVal {
    const env: Environment = this.resolve(varname);

    if (!this.variables.has(varname)) {
      throw `Cannot assign to variable ${varname} as it was not defined`;
    }

    if (this.constants.has(varname)) {
      throw `Cannot reassign to variable ${varname} as it was declared constant`;
    }
    env.variables.set(varname, val);
    return val;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  //recursively search through environments for variable
  private resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent == undefined) {
      throw `Cannot resolve ${varname} as it does not exist.`;
    }
    return this.parent.resolve(varname);
  }
}
