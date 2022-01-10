import './stylesheet.scss';

import CacheSettings from './cacheSettings';
import ClearCache from './clearCache';

const Performance = () => {
	
	return (
		<div className="hgwp-Performance grid col2">
			
			<CacheSettings />
			<ClearCache />

		</div>
	);
};

export default Performance;
