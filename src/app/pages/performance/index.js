import './stylesheet.scss';
import graphicUrl from '../../../../assets/svg/a-illustration__checklist.svg';
import CacheSettings from './cacheSettings';
import ClearCache from './clearCache';
import SettingsCallout from './settingsCallout';
import { useViewportMatch } from '@wordpress/compose';

const Performance = () => {
	const isWideViewport = useViewportMatch('large');

	return (
		<div className="hgwp-Performance grid col2 has-page-graphic">
			<CacheSettings />
			{isWideViewport && (
				<div>
					<img
						src={graphicUrl}
						style={{ float: 'right' }}
						alt={__(
							'Performance illustration',
							'wp-plugin-hostgator'
						)}
					/>
				</div>
			)}
			<ClearCache />
			<SettingsCallout />
		</div>
	);
};

export default Performance;
