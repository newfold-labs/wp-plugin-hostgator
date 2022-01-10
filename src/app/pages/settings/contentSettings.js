import {
	Card,
	CardBody,
	CardHeader,
	SelectControl,
	__experimentalHeading as Heading
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar
} from '../../util/helpers';

const ContentSettings = () => {
	const { store, setStore } = useContext(AppStore);
	const [ contentRevisions, setNumContentRevisions ] = useState( store.contentRevisions );
	const [ emptyTrashDays, setNumEmptyTrashDays ] = useState( store.emptyTrashDays );
	let numTrashWeeks = Math.floor( emptyTrashDays / 7 );
	const contentRevisionsLabelText = () => {
		// `Keep ${contentRevisions} latest revision(s)`
		return <span>
			{ __( 'Keep ', 'hostgator-wordpress-plugin' ) } 
			<strong>{ contentRevisions }</strong>
			{ _n( ' latest revision', ' latest revisions', contentRevisions, 'hostgator-wordpress-plugin' ) }
		</span>;
	};
	const contentRevisionsHelpText = () => {
		//`Posts will save ${contentRevisions} revisions.`
		return <span>
			{ __( 'Posts will save ', 'hostgator-wordpress-plugin' ) } 
			<strong>{ contentRevisions }</strong>
			{ _n( ' revision', ' revisions', contentRevisions, 'hostgator-wordpress-plugin' ) }
		</span>;
	};
	const contentRevisionsNoticeText = () => {
		return 'Post revision setting saved';
	};
	const emptyTrashDaysLabelText = () => {
		// `Empty trash every ${numTrashWeeks} week(s).`
		return <span>
			{ __( 'Empty trash every ', 'hostgator-wordpress-plugin' ) } 
			<strong>{ numTrashWeeks }</strong>
			{ _n( ' week.', ' weeks.', numTrashWeeks, 'hostgator-wordpress-plugin' ) }
		</span>;
	};
	const emptyTrashDaysHelpText = () => {
		//`The trash will automatically empty every ${numTrashWeeks} week(s).`
		return <span>
			{ __( 'The trash will automatically empty every ', 'hostgator-wordpress-plugin' ) } 
			<strong>{ numTrashWeeks }</strong>
			{ _n( ' week.', ' weeks.', numTrashWeeks, 'hostgator-wordpress-plugin' ) }
		</span>;
	};
	const emptyTrashDaysNoticeText = () => {
		return 'Trash setting saved';
	};

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch( { contentRevisions } ).then( () => {
            setStore({
                ...store,
                contentRevisions,
            });
            dispatchUpdateSnackbar( contentRevisionsNoticeText() );
        });
	}, [contentRevisions]);

	useUpdateEffect(() => {
		numTrashWeeks = Math.floor( emptyTrashDays / 7 );
		hostgatorSettingsApiFetch( { emptyTrashDays } ).then( () => {
            setStore({
                ...store,
                emptyTrashDays,
            });
            dispatchUpdateSnackbar( emptyTrashDaysNoticeText() );
        });
	}, [emptyTrashDays]);


	return (

        <Card>
            <CardHeader>
                <Heading level="3">{ __( 'Content Options', 'hostgator-wordpress-plugin' ) }</Heading>
            </CardHeader>
            <CardBody>
                { __( 'Controls for content revisions and how often to empty the trash.', 'hostgator-wordpress-plugin' ) }
            </CardBody>
            <CardBody>
				<SelectControl
                    label={ contentRevisionsLabelText() }
                    value={ contentRevisions }
                    help={ contentRevisionsHelpText() }
                    options={ [
                        { label: '1', value: '1' },
                        { label: '5', value: '5' },
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '40', value: '40' },
                    ] }
                    onChange={ ( value ) => setNumContentRevisions( value ) }
                />
            </CardBody>

            <CardBody>
				<SelectControl
                    label={ emptyTrashDaysLabelText() }
                    value={ emptyTrashDays }
                    help={ emptyTrashDaysHelpText() }
                    options={ [
						{ label: '1', value: '7' },
						{ label: '2', value: '14' },
						{ label: '3', value: '21' },
						{ label: '4', value: '30' },
                    ] }
                    onChange={ ( value ) => setNumEmptyTrashDays( value ) }
                />
            </CardBody>
        </Card>
    );
};

export default ContentSettings;