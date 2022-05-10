import { TArtifact } from "../components/Modal/ArtifactList"
import { BASE_PATH_RESTRICTED } from "../config/config"

// const ARTIFACT_PAGE_URL_BASE = `${BASE_URL}${BASE_PATH_RESTRICTED}/artifacts/`
const ARTIFACT_PAGE_URL_BASE = `${BASE_PATH_RESTRICTED}/artifacts/`

export function getArtifactURL(a: TArtifact): string {
    return `${ARTIFACT_PAGE_URL_BASE}textartifact?artifactPath=${a.path}&artifactName=${a.name}`
}