import React from "react";
import classNames from "classnames";

import "./Panel.scss";

/* 
* re-usable dropdown panel to reduce duplicate styling etc.
* props: children, className, ...rest
* 	children: children elements to passthrough and show inside of panel
*		className: additional custom styling classes to merge with panel styling
*		rest: any additional props to pass through
*/

function Panel({children, className, ...rest }){
	const mergedClassNames = classNames('panel', className);

	return <div {...rest} className={mergedClassNames}>{children}</div>
}

export default Panel;