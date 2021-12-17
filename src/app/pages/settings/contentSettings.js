import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	CardFooter,
	SelectControl,
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const ContentSettings = () => {
	const { store, setStore } = useContext(AppStore);
	const [ numContentRevisions, setNumContentRevisions ] = useState( store.contentRevisions );
	const [ numEmptyTrashDays, setNumEmptyTrashDays ] = useState( store.emptyTrashDays );
	let numTrashWeeks = Math.floor( numEmptyTrashDays / 7 );
	useEffect(() => {
		setStore({
			...store,
			contentRevisions: numContentRevisions,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			contentRevisions: numContentRevisions
		} } );
	}, [numContentRevisions]);

	useEffect(() => {
		numTrashWeeks = Math.floor( numEmptyTrashDays / 7 );
		setStore({
			...store,
			emptyTrashDays: numEmptyTrashDays,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			emptyTrashDays: numEmptyTrashDays
		} } );
	}, [numEmptyTrashDays]);

	return (

        <Card>
            <CardHeader>
                <Heading level="3">Content Options</Heading>
            </CardHeader>
            <CardBody>
                Controls for content revisions and how often to empty the trash.
            </CardBody>
            <CardBody>
				<SelectControl
					aria-label="Keep x latest revisions"
                    label={`Keep ${numContentRevisions} latest revisions`}
                    value={ numContentRevisions }
                    help={`Posts will save ${numContentRevisions} revisions.`}
                    options={ [
                        { label: '1', value: '1' },
                        { label: '5', value: '5' },
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '40', value: '40' },
                    ] }
                    onChange={ ( state ) => setNumContentRevisions( state ) }
                />
            </CardBody>

            <CardBody>
				<SelectControl
					aria-label="Empty the trash every x weeks"
                    label={`Empty trash every ${numTrashWeeks} week${numTrashWeeks > 1 ? 's': ''}`}
                    value={ numEmptyTrashDays }
                    help={`The trash will automatically empty every ${numTrashWeeks} week${numTrashWeeks > 1 ? 's': ''}.`}
                    options={ [
						{ label: '1', value: '7' },
						{ label: '2', value: '14' },
						{ label: '3', value: '21' },
						{ label: '4', value: '30' },
                    ] }
                    onChange={ ( state ) => setNumEmptyTrashDays( state ) }
                />
            </CardBody>
        </Card>
    );
};

export default ContentSettings;