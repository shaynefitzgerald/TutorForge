//
//  Login.m
//  TutorMe
//
//  Created by Christian Valderrama on 10/13/15.
//  Copyright © 2015 soft_dev2_group1. All rights reserved.
//
// Class is used for Main display when user opens app. Also for them
// to login to our services. 

#import "Login.h"

@interface Login ()

@end

@implementation Login

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
/* 
 * Method is used for when a user clicks on the login button. 
 * Checks to see if they have both fields entered and checks 
 * to make sure they are a user/student.
 */
- (IBAction)LoginButton:(id)sender {
    
    if([_myUsernameTextField.text isEqualToString:@""] || [_myPasswordTextField.text isEqualToString:@""])
    {
        //Alert Box to display error
        UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"Error"
                                                                       message:@"Both fields must be filled" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* cancelAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction * action) {}];
        
        [alert addAction:cancelAction];
        [self presentViewController:alert animated:YES completion:nil];
    }else {
        
        NSString *myUsername = _myUsernameTextField.text;
        NSString *myPassword = _myPasswordTextField.text;
        
    }
}

@end
