import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faDownload, faFile, faFileSignature, faHandsHelping, faKey, faPaperPlane, faPencilAlt, faProjectDiagram, faPuzzlePiece, faSave, faTimes, faTimesCircle, faTrash, faUserAlt, faUserAltSlash, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'


export const editIcon = faPencilAlt
export const openIcon = faFile
export const deleteIcon = faTrash
export const publishIcon = faBook
export const unpublishIcon = faBook
export const scratchIcon = faBook
export const unscratchIcon = faBook
export const newIcon = faFile
export const renameIcon = faFileSignature
export const saveIcon = faSave
export const visualizeIcon = faProjectDiagram
export const generateIcon = faPuzzlePiece
export const downloadIcon = faDownload
export const closeIcon = faTimes
export const passwordIcon = faKey
export const loginIcon = faUserAlt
export const logoutIcon = faUserAltSlash
export const submitIcon = faPaperPlane
export const cancelIcon = faTimesCircle
export const adminIcon = faPencilAlt
export const handIcon = faHandsHelping

export default function IconButton(props: { icon: IconDefinition, label: string, onClick?: () => any }) {
    return (
        <Button onClick={props.onClick}>
            <FontAwesomeIcon className="w3-xlarge center" icon={props.icon} /> {props.label}
        </Button>
    )
}
