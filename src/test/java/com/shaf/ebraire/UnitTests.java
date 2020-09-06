package com.shaf.ebraire;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static org.junit.Assert.assertEquals;

class UnitTests {
    @Test
    void unitTest(){
        assertEquals(2,2);
    }
}
